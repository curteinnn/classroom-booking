import gsap from gsap;

export default function homeAnimation(home){
    const rooms = home.querySelector(".rooms")
    const card = home.querySelecor(".card1")
    const tl = gsap.timeline();

    tl.from(card, {
        opacity:0,
        y:80,
        ease:"power3.inOut",
        duration:3,

    })
}
