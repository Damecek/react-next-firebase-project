import Loader from '../components/Loader';
import {firestore, postToJSON, fromMillis} from '../lib/firebase';
import {useState} from 'react';
import PostFeed from '../components/PostFeed';

const LIMIT = 12;

export async function getServerSideProps(context) {
    const queryGroup = firestore.collectionGroup('posts')
        .where('published', '==', true)
        .orderBy('createdAt', 'desc').limit(LIMIT);
    const posts = (await queryGroup.get()).docs.map(postToJSON);
    return {props: {posts}};
}

export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);

    const getMorePosts = async () => {
        if (!posts) {
            setPostsEnd(true);
            return;
        }
        setLoading(true);
        const last = posts[posts.length - 1];
        const cursor = typeof last?.createdAt === 'number' ? fromMillis(last?.createdAt) : last?.createdAt;
        if (!cursor) {
            setLoading(false);
            setPostsEnd(true);
            return;
        }

        const queryGroup = firestore.collectionGroup('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc').startAfter(cursor).limit(LIMIT);
        const newPosts = (await queryGroup.get()).docs.map((doc) => doc.data());
        setPosts(posts.concat(newPosts));
        setLoading(false);
        if (newPosts.length < LIMIT) setPostsEnd(true);
    };

    return (
        <main>
            <PostFeed posts={posts}/>
            {!loading && !postsEnd && <button onClick={getMorePosts}>Load More</button>}
            <Loader show={loading}/>
            {postsEnd && 'You have reached an end.'}
        </main>
    );
}
