// DOM Elements
const $usersContainer = $('.Users');
const $postsContainer = $('.Posts');
const $userContainer = $('.User');
const $postTitle = $('#post_title');
const $postBody = $('#post_body');

// Post Info
let currentUser;
let currentPost;
// Booleans
let isAlphabetical = false;

// Dynamically created btns
const $editPostBtn = '.Post__btns--edit';
const $editPostSubmit = '.Posts__edit-post--submit';
const $viewPostsBtn = '.User__view-posts';
const $deletePostBtn = '.Post__btns--delete';
const $postSubmitBtn = $('.Posts__add-post--submit');

// Nav Btns
const $homeBtn = $('.Nav__home-btn');
const $sortBtn = $('.Nav__sort-btn');

/**
 * Page load -- Hide container and Get posts
 */
$postsContainer.hide(); 
fetchData('http://jsonplaceholder.typicode.com/users', appendUsers);


/********************
 *** CLICK EVENTS ***
 ********************/

// Show clicked users posts
$usersContainer.on('click', $viewPostsBtn, function () {
    hideUsers(); // Hide users div
    currentUser = $(this).attr('id');
    fetchData(`http://jsonplaceholder.typicode.com/posts?userId=${currentUser}`, appendPosts);
});

// Edit post submit button
$postsContainer.on('click', $editPostSubmit, function (e) {
    // Updated tilte
    const title = $(this).parent().find('#post_title').val();
    // Updated body
    const body = $(this).parent().find('#post_body').val();
    editPost(title, body, currentUser, currentPost);
})

// Go back to main page to display list of users
$homeBtn.on('click', function () {
    showUsers();
});

// Toggle sort by title on click
$sortBtn.on('click', function () {
    sortPostTitles();
});

// Add new post submit button -- add post
$postSubmitBtn.on('click', function (e) {
    e.preventDefault();
    const title = $postTitle.val();
    const body = $postBody.val();
    postData(title, body, currentUser);
});

// Edit post btn -- replace post HTML with form
$postsContainer.on('click', $editPostBtn, function () {
    const $post = $(this).parent().parent();
    const title = $post.find('.Post__title').text();
    const body = $post.find('.Post__body').text();
    currentPost = $(this).attr('id');
    $post.replaceWith(`
        <form class="Posts__edit-post">
            <h4>Edit Post</h4>
            <div class="form-group">
                <label for="post_title">Post Title:</label>
                <input value="${title}" type="text" class="form-control" id="post_title">
            </div>
            <div class="form-group">
                <label for="post_body">Post Title:</label>
                <textarea type="text" class="form-control" id="post_body">${body}</textarea>
            </div>
            <button type="button" class="btn btn-primary Posts__edit-post--submit">Submit Post</button>
        </form>
    `);
});

// Delete post
$postsContainer.on('click', $deletePostBtn, function () {
    const clickedId = $(this).attr('id');
    deletePost(clickedId);
});


/**
 * toggle sort for post titles 
 */
function sortPostTitles() {
    const titleArr = [];
    if (!isAlphabetical) {
        Array.from($('.Post__title')).forEach(title => titleArr.push(title.innerText));
        titleArr.sort(function (a, b) {
            if (a[0] > b[0]) return 1;
        })
        Array.from($('.Post__title')).forEach((title, index) => {
            title.innerText = titleArr[index];
        });
        isAlphabetical = true;
    } else {
        Array.from($('.Post__title')).forEach(title => titleArr.push(title.innerText));
        titleArr.sort(function (a, b) {
            if (a[0] < b[0]) return 1;
        })
        Array.from($('.Post__title')).forEach((title, index) => {
            title.innerText = titleArr[index];
        });
        isAlphabetical = false;
    }
}

/**
 * Fetch data and handle it with the passed in function
 * @param {String} url - the url where data will be fetched
 * @param {Function} handleDataFunction - the function that will handle the data
 */
function fetchData(url, handleDataFunction) {
    fetch(url)
        .then(response => response.json())
        .then(json => {
            handleDataFunction(json);
        });
}

/**
 * Post data from a new user post
 * @param {String} title - the post tilte
 * @param {String} body - the post body
 * @param {Number} userId - the user id
 */
function postData(title, body, userId) {
    // POST adds a random id to the object sent
    fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                body: body,
                userId: userId
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json))
}

/**
 * Update edited post based on userid and post id
 * @param {String} title - the edited post title
 * @param {String} body - the edited post body
 * @param {Number} userId - the user id
 * @param {Number} postId - id of the post being edited
 */
function editPost(title, body, userId, postId) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'PUT',
            body: JSON.stringify({
                id: postId,
                title: title,
                body: body,
                userId: userId
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
        .then(json => console.log(json))
}

/**
 * Delete clicked post
 * @param {Number} clickedPost - the id of the post to be deleted
 */
function deletePost(clickedPost) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${clickedPost}`, {
        method: 'DELETE'
    });
}

/**
 * Append users based on information from fetched data
 * @param {Array} users - the array of users fetched
 */
function appendUsers(users) {
    users.forEach((user) => {
        $usersContainer.append(`
            <div class="User">
                <ul>
                    <li>
                    ${user.username}
                    <ul>
                        <li>${user.address.street}</li>
                        <li>${user.address.suite}</li>
                        <li>${user.address.city}</li>
                        <li>${user.address.zipcode}</li>
                    </ul>
                    </li>
                </ul>
                <div>
                    <button id="${user.id}" class="btn btn-primary User__view-posts">View Posts</button>
                </div>
            </div>
        `);
    });
}

/**
 * Append posts based on information from fetched data
 * @param {Array} posts - the array of posts fetched
 */
function appendPosts(posts) {
    posts.forEach((post) => {
        $postsContainer.append(`
            <div class="Post">
                <h3 class="Post__title">${post.title}</h3>
                <p class="Post__body">${post.body}</p>
                <div class="Post__btns">
                    <button id="${post.id}" class="btn btn-secondary Post__btns--edit">Edit Post</button>
                    <button id="${post.id}" class="btn btn-danger Post__btns--delete">Delete Post</button>
                </div>
            </div>
        `);
    });
}

/**
 * Show Users div and hide Posts div
 */
function showUsers() {
    $usersContainer.show();
    $postsContainer.hide();
}

/**
 * Show Posts div and hide Users div
 */
function hideUsers() {
    $usersContainer.hide();
    $postsContainer.show();
}