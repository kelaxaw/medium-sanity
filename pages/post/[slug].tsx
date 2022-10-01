import { GetStaticProps } from "next";
import React, { useState } from "react";
import { Header } from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { IPost } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: IPost;
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  //   console.log(post);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />

      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()}
        alt=""
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-5-- mb-2">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full border border-gray-300"
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <PortableText
            className="mt-10"
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5">{props}</h1>
              ),
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5">{props}</h1>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a
                  target="_blank"
                  href={href}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-400" />

      {submitted ? (
        <div className="flex flex-col py-10 px-5 bg-yellow text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thank you for submitting comment
          </h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col my-10 p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h2 className="text-3xl font-bold">Leave a comment below!</h2>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 form-input"
              placeholder="John Appleseed"
              type="text"
            />
          </label>

          <div>
            {errors.name && (
              <span className="text-red-500">The name field is required</span>
            )}
          </div>

          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 form-input"
              placeholder="johnapple@mail.com"
              type="email"
            />
          </label>

          <div>
            {errors.email && (
              <span className="text-red-500">The email field is required</span>
            )}
          </div>

          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 mt-1 block w-full ring-yellow-500 form-textarea"
              placeholder="LOL"
              rows={0}
            />
          </label>

          <div>
            {errors.comment && (
              <span className="text-red-500">
                The comment field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            value="Add comment"
            className="bg-yellow shadow hover:opacity-50 focus:shadow-outline focus:outline-none text-white font-bold py-2 rounded cursor-pointer px-4"
          />
        </form>
      )}

      <div className="rounded flex flex-col p-10 my-10 max-w-2xl mx-auto shadow bg-white space-y-2">
        <h3 className="text-3xl">Comments</h3>
        <hr />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}</span>:
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `
    *[_type == "post"]{
        _id,
        slug { 
        current
      }
      }
    `;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: IPost) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0] {
            _id,
            _createdAt,
            title,
            author -> {
                name,
                image
            },
            'comments': *[
                _type == "comment" &&
                post._ref == ^._id &&
                approved == true],
            description,
            mainImage,
            slug,
            body
        }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
