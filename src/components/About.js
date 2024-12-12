import React from 'react'

const About = () => {
    return (
        <div className="about-container">
            <div className="header">
                <h1>About Us</h1>
            </div>

            <div className="about-section">
                <h2>The Project</h2>
                <div className="about-section-content">
                    <img src="/querini-logo.jpg"></img>
                    <p>
                        The Commercial Guide Digital Library is a tool we developed in collaboration with the <a href="querinistampalia.org">Fondazione Querini Stampalia</a> to preserve and digitize Venice’s industrial history. By analyzing historic commercial guides, the platform makes records of factories, industries, and business locations easily accessible. This work connects Venice’s past with its present, giving researchers, historians, and anyone curious about the city’s industrial evolution a way to explore it from the late 19th to early 20th centuries. With this tool, we hope to make it easier to identify historical patterns and appreciate Venice’s industrial heritage.
                    </p>
                </div>
                
            </div>

            <div className="about-section">
                <h2>Our Mission</h2>
                <p>
                    Our mission is to create tools and resources that make it easier to preserve and study Venice’s industrial history. We want to help more people discover, analyze, and share insights into the city’s industrial past. By combining digital tools with  historical research, we’re focused on making sure these records stay accessible for future generations. Our goal is to support researchers, educators, and the community in exploring and understanding how Venice’s industrial heritage has shaped its story.
                </p>
            </div>

            <div className="about-section">
                <h2>Who We Are</h2>
                <p>
                    We are a group of students at Worcester Polytechnic Institute completing a project on the preservation of Venice’s industrial history. By combining archival research with  digital tools, we’ve worked to turn historical records into something anyone can access and explore.
                </p>
            </div>

            

            <div className="about-section">
                <h2>Acknowledgements</h2>
                <p>
                    This project wouldn’t have been possible without the help and support of so many people and organizations. We’re especially grateful to the archivists and librarians who gave us access to the commercial guides, and  our advisors, Ruth McKeogh and Francis Leahy who guided us along the way.
                </p>
            </div>

            <div className="about-footer">
                <h3><a href="https://sites.google.com/view/v24b-ind/home">Learn More</a></h3>
            </div>
        </div>
    );
}

export default About;