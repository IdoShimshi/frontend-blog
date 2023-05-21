import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import Pagination from "../components/Pagination";
import prisma from '../lib/prisma'
import {getPublicIds} from "../mongoDB/videoCollection"

const PAGE_SIZE = 10;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = parseInt(query.page as string) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const [feed, count] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      take: PAGE_SIZE,
      skip,
      orderBy: {
        id: 'desc',
      },
    }),
    prisma.post.count({
      where: {
        published: true,
      },
    }),
  ]);

  const pageCount = Math.ceil(count / PAGE_SIZE);
  const postIdToPublicId = await getPublicIds(feed.map((post) => post.id));
  const enrichedFeed = feed.map((post) =>({
    ...post,
    videoPublicId: postIdToPublicId[post.id],
  }));
  console.log(enrichedFeed[0]);

  return {
    props: { enrichedFeed, pageCount, page },
  };
};

type Props = {
  enrichedFeed: PostProps[];
  pageCount: number;
  page: number;
};

const Blog: React.FC<Props> = ({ enrichedFeed, pageCount, page }) => {
  const pages = [];

  const handlePageChange = (newPage: number) => {
    // Prevent page change if already on the same page
    if (newPage === page) return;

    // Navigate to the new page
    window.location.href = `/?page=${newPage}`;
  };

  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {enrichedFeed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
        <div className="pagination">
          <Pagination props={{page, pageCount, handlePageChange}} />
        </div>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }

        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .pagination button {
          font-size: 1.4rem;
          border: none;
          background: none;
          cursor: pointer;
        }
        

        .pagination .active {
          font-weight: bold;
          color: gray;
          pointer-events: none;
        }

        .pagination .disabled {
          color: #aaa;
          pointer-events: none;
        }
      `}</style>
    </Layout>
  );
};



export default Blog;
