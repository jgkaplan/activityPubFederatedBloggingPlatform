module.exports = {
  devServer: {
    historyApiFallback: false,
    proxy: "http://localhost:3000"
    // {
    //     "/api":
    // }
  }
}
