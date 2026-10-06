import {ResponsiveImage} from "../components/editorial-image";
import Reveal from "../components/reveal";

export default function About() {
  return <main className="page about-page">
    
    <Reveal><section className="about-page-intro">
      <div>
        <p className="kicker">ABOUT RANISA BOUTIQUE</p>
        <h1>Tradition, with<br/><i>a personal touch.</i></h1>
        <p>Ranisa Boutique is a home for traditional Indian wear and thoughtful customisation. We bring together suits, lehengas and dress materials for celebrations, family gatherings and the moments that become treasured memories.</p>
        <p>Based in Dehradun, we’re happy to help you explore colours, fabrics and finishing details, or plan an outfit made to order around your occasion and ideas.</p>
        <div className="about-page-actions"><a className="cta" href="/shop">EXPLORE THE COLLECTION</a><a className="text-link" href="/custom">ASK ABOUT A CUSTOM ORDER</a></div>
      </div>
      <figure className="about-photo"><ResponsiveImage asset="about" alt="Traditional Indian clothing in an ornate gold setting"/><figcaption>Traditional style, chosen with care.</figcaption></figure>
    </section></Reveal>
    <Reveal><section className="about-values">
      <article><span>01</span><h2>Traditional styles</h2><p>Discover Indian wear for festive days, special occasions and everything in between.</p></article>
      <article><span>02</span><h2>Made to order</h2><p>Share your ideas for a suit, lehenga or dress material and we’ll discuss the details together.</p></article>
      <article><span>03</span><h2>Personal service</h2><p>We’re here to help with product questions, custom enquiries and order details.</p></article>
    </section></Reveal>
    <Reveal><section className="about-visit"><div><p className="kicker">COME SAY HELLO</p><h2>Visit or get in touch.</h2><p>#215 Engineer’s Enclave, opposite Ram Krishna Mandir, Dehradun, Uttarakhand 248171</p></div><a className="cta" href="/contact">CONTACT US</a></section></Reveal>
  </main>;
}
