import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'

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

  return {
    props: { feed, pageCount, page },
  };
};

type Props = {
  feed: PostProps[];
  pageCount: number;
  page: number;
};

const Blog: React.FC<Props> = ({ feed, pageCount, page }) => {
  const pages = [];

  const handlePageChange = (newPage: number) => {
    // Prevent page change if already on the same page
    if (newPage === page) return;

    // Navigate to the new page
    window.location.href = `/?page=${newPage}`;
  };

  for (let i = Math.max(page - 4, 1); i <= pageCount && i <= page + 4; i++) {
    pages.push(
      <button
        key={i}
        className={i === page ? "active" : ""}
        onClick={() => handlePageChange(i)}
        disabled={i === page}
        aria-disabled={i === page}
      >
        {i}
      </button>
    );
  }
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
        <div className="pagination">
          <button
            className={page === 1 ? "disabled" : ""}
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            &laquo;
          </button>
          {pages}
          <button
            className={page === pageCount ? "disabled" : ""}
            disabled={page === pageCount}
            onClick={() => handlePageChange(page + 1)}
          >
            &raquo;
          </button>
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
