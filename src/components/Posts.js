import '../css/Posts.css';
import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/posts`);
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          setError('Failed to fetch posts');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="posts-container">
      <h1>Your Posts</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;