import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useParams } from 'react-router-dom';
import BlogTemplate from '../components/BlogTemplate';
import { getBlogPostBySlug } from '../data/posts';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return <BlogTemplate post={post} />;
};

export default BlogPostPage;
