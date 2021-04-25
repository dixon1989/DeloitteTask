import axios from "axios";

// Get json Data from public folder - this is one of the option for data retrieval. Running server is recommended
// I have also added launches array data at ./public just in case server is not working, you can add it with `./launches.json`
export const getRocketData = async () => {
      try {
        const req = await axios
          .get(`http://localhost:8001/launches`);
        if (req.status === 200) {
          let data = req.data
          return data
        }
      } catch (error) {
        return error
      }
  }