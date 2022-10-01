import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Header } from "../components/Header";
import mmm from "../public/mmm.svg";
import { sanityClient, urlFor } from "../sanity";
import { IPost } from "../typings";

interface Props {
  posts: [IPost];
}

const Home = ({ posts }: Props) => {
  //console.log(posts);
  return (
    <div>
      <Head>
        <title>Medium</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <section className="flex justify-between bg-yellow border-b border-black">
        <div className="lg:ml-[141px] px-5 pb-24">
          <h1 className="text-8xl font-serif leading-none mt-[93px]">
            Stay curious.
          </h1>

          <h2 className="text-[24px] mt-[35px]">
            Discover stories, thinking, and expertise
            <br /> from writers on any topic.
          </h2>

          <button className="rounded-full bg-black text-white text-[20px] px-20 py-2 mt-[50px]">
            Start reading
          </button>
        </div>

        <div className="hidden lg:block">
          <Image
            src={mmm}
            alt=""
            width={500}
            height={500}
            objectFit={"cover"}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6">
        {posts.map((post) => {
          return (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="group cursor-pointer border rounded-lg overflow-hidden">
                <img
                  src={urlFor(post.mainImage).url()}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                  alt=""
                />

                <div className="flex justify-between p-5 bg-white">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">
                      {post.description} by {post.author.name}
                    </p>
                  </div>

                  <img
                    className="h-12 w-12 rounded-full border border-gray-300"
                    src={urlFor(post.author.image).url()}
                    alt=""
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
    slug,
    description,
    mainImage,
    author -> {
    name,
    image
    }
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};

export default Home;
