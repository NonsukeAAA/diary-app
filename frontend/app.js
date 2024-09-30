const API_URL = 'http://localhost:8000';

const app = new Vue({
    el: '#app',
    data: {
        view: 'login',
        username: '',
        password: '',
        token: '',
        posts: [],
        newPost: {
            title: '',
            content: '',
            date: new Date().toISOString().split('T')[0]
        },
        error: ''
    },
    methods: {
        async login() {
            try {
                const response = await axios.post(`${API_URL}/token`, 
                    `username=${this.username}&password=${this.password}`,
                    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
                );
                this.token = response.data.access_token;
                this.error = '';
                this.view = 'posts';
                this.fetchPosts();
            } catch (error) {
                this.error = 'Login failed. Please check your credentials.';
            }
        },
        async fetchPosts() {
            try {
                const response = await axios.get(`${API_URL}/posts`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
                this.posts = response.data;
            } catch (error) {
                this.error = 'Failed to fetch posts.';
            }
        },
        async createPost() {
            try {
                await axios.post(`${API_URL}/posts`, this.newPost, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
                this.newPost = { title: '', content: '', date: new Date().toISOString().split('T')[0] };
                this.fetchPosts();
            } catch (error) {
                this.error = 'Failed to create post.';
            }
        },
        async deletePost(id) {
            try {
                await axios.delete(`${API_URL}/posts/${id}`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
                this.fetchPosts();
            } catch (error) {
                this.error = 'Failed to delete post.';
            }
        },
        logout() {
            this.token = '';
            this.view = 'login';
            this.username = '';
            this.password = '';
        }
    },
    template: `
        <div>
            <div v-if="error" style="color: red;">{{ error }}</div>
            <div v-if="view === 'login'">
                <h2>Login</h2>
                <input v-model="username" placeholder="Username" />
                <input v-model="password" type="password" placeholder="Password" />
                <button @click="login">Login</button>
            </div>
            <div v-else-if="view === 'posts'">
                <button @click="logout" style="float: right;">Logout</button>
                <h2>New Post</h2>
                <input v-model="newPost.title" placeholder="Title" />
                <textarea v-model="newPost.content" placeholder="Content"></textarea>
                <input v-model="newPost.date" type="date" />
                <button @click="createPost">Create Post</button>
                <h2>Your Posts</h2>
                <div v-for="post in posts" :key="post.id" class="post">
                    <h3>{{ post.title }}</h3>
                    <p>{{ post.content }}</p>
                    <p>Date: {{ new Date(post.date).toLocaleDateString() }}<p>Date: {{ new Date(post.date).toLocaleDateString() }}</p>
                    <button @click="deletePost(post.id)">Delete</button>
                </div>
            </div>
        </div>
    `
});