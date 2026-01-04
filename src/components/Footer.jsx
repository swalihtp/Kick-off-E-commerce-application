import {Link} from 'react-router-dom'
import './footer.css'
function Footer(){
    return(
        <footer>
            <div >
                <h3>About</h3>
                <Link>contact us</Link>
                <Link>about us</Link>
                <Link>careers</Link>
                <Link>kick-off stories</Link>
                <Link>press</Link>
                <Link>corperate informations</Link>
            </div>
            <div>
                <h2>Help</h2>
                <Link>Payment</Link>
                <Link>Shipping</Link>
                <Link>FAQ</Link>
            </div>
            <div>
                <h3>Registered Office Address</h3>
                <p>
                    Kick-Off Sports Pvt. Ltd.<br></br>
                    Registered Office: Suite 502, Orion Business Tower, 45/7 MG Road, Bangalore – 560001, Karnataka, India<br></br>
                    Phone: +91 80 1234 5678<br></br>
                    Email: contact@kickoff.com
                </p>
            </div>
        </footer>
    );
}
export default Footer