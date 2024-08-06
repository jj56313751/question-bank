/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  transpilePackages: ['antd', '@ant-design/icons'],
  reactStrictMode: false,
}

module.exports = nextConfig
