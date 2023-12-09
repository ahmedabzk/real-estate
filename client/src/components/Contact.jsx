import { useEffect, useState } from "react"
import { Link } from "react-router-dom";


export default function Contact({ listing }) {
    
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`http://localhost:3000/api/user/${listing.userRef}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
            }
            setLandlord(data);
        }
        getUser();
    }, [listing.userRef]);

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

  return (
    <>
          {landlord && (
              <div className="flex flex-col gap-2">
                  <p>
                      Contact <span className="font-semibold"> {landlord.username} </span>
                      for{' '}
                      <span className="font-semibold">{listing.name}</span>
                  </p>
                  <textarea
                      name="message"
                      id="message"
                      rows='2'
                      value={message}
                      onChange={handleChange}
                      placeholder="Enter your message here..."
                      className="w-full border p-3 rounded-lg"
                  />
                  <Link
                      to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                      className="bg-slate-700 text-white  text-center p-3 rounded-lg uppercase hover:opacity-95">
                      send message
                  </Link>
              </div>
          )}
    </>
  )
}
