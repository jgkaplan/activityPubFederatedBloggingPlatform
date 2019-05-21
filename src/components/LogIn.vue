<template>
    <div>
        <h2>Login</h2>
        <form v-on:submit.prevent="login">
            <input type="text" name="username" /><br>
            <input type="password" name="password" /><br>
            <input type="submit" value="Login" />
        </form>
    </div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "LogIn",
        methods: {
            login: (e) => {
                e.preventDefault();
                let data = {
                    email: e.target.username.value,
                    password: e.target.password.value
                }
                // axios.post("/api/login", data)
                axios.post('/api/login', data)
                    .then((res) => {
                        if(res.status == 200){
                            console.log("Logged in");
                        }else{
                            console.log("Cannot log in");
                        }
                    }).catch((err) => {
                        console.log("Cannot log in")
                    })
            }
        }
    }
</script>
