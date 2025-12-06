import BookDetails from "@/components/BookDetails";

export default function About({ book }) {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About the Developer</h1>
        <p className="about-subtitle">Rohit Sivakumar</p>
        
        <div className="about-text">
          <p>
            Passionate about building scalable, impactful solutions and contributing to teams that value clean code, innovation, and continuous improvement. Currently working as a junior software developer with hands-on experience in C, C++, Python, Java, JavaScript, TypeScript, HTML, CSS, and SQL. I bring a strong foundation in full-stack development, and I'm continuously expanding my skill set through real-world projects, academic challenges, and self-driven learning.
          </p>
          <p>
            While completing an Advanced Diploma in Computer Programming and Analysis at Seneca Polytechnic, I'm on track to further deepen my technical expertise by transitioning into McMaster University's Bachelor of Technology in Software Engineering Technology program. Already increasing efficiencies and reducing errors in systems for organizations- I plan to continue into a long and fruitful career for both myself and the teams I work with. My goal is to join a forward-thinking development team where I can grow, take on increasing responsibility, and help shape technologies that move industries forward.
          </p>
        </div>

        <BookDetails book={book} workId="OL453657W" showFavouriteBtn={false} />
      </div>
      <style jsx>{`
        .about-container {
          background: white;
          min-height: 100vh;
          padding: 40px 20px;
        }
        .about-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        .about-title {
          font-size: 2.5rem;
          color: #5dade2;
          text-align: center;
          margin: 0 0 10px 0;
          font-weight: 400;
        }
        .about-subtitle {
          color: #666;
          text-align: center;
          margin: 0 0 40px 0;
          font-size: 1rem;
        }
        .about-text {
          margin-bottom: 60px;
        }
        .about-text p {
          color: #000;
          line-height: 1.6;
          margin-bottom: 20px;
          text-align: left;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://openlibrary.org/works/OL453657W.json");
  const data = await res.json();

  return {
    props: {
      book: data,
    },
  };
}
