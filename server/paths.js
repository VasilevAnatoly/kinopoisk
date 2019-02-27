const path = require('path');

const publicPath = path.join(process.cwd(), '/public');
const moviePreviewsPath = path.join(publicPath, '/previews');

module.exports = {
    publicPath: publicPath,
    moviePreviewsPath: moviePreviewsPath,
}