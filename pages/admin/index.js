import AuthCheck from '../../components/AuthCheck';

function AdminPostsPage(props) {
    return (
        <main>
            <AuthCheck>
                admin
            </AuthCheck>
        </main>
    );
}

export default AdminPostsPage;