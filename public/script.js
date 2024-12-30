const blogsListings = document.getElementsByClassName("listing")
const orbitRings = document.getElementsByClassName("ring")
const DELAY_BETWEEN_LISTINGS_IN_SECONDS = 10;

let counter = 0;
Array.from(blogsListings).forEach(blogListing => {
    blogListing.addEventListener("click", (e) => { e.stopPropagation() });
});

Array.from(orbitRings).forEach(ring =>  {
    prepOrbits(ring, counter)
    counter = counter+DELAY_BETWEEN_LISTINGS_IN_SECONDS;
})

function prepOrbits(ring, counter) {
    ring.style.setProperty('animation-delay', `${counter}s`)
}