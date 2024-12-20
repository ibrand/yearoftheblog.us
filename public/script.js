let blogsListings = document.getElementsByClassName("listing")

// Items should not do any funky click animations
Array.from(blogsListings).forEach(blogListing => {
    blogListing.addEventListener("click", (e) => { e.stopPropagation() });
});