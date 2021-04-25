import axios from "axios";

// Get json Data from public folder - this is one of the option for data retrieval. Running server is recommended
export const getRocketData = async () => {
      try {
        const req = await axios
          .get(`./launches.json`);
        if (req.status === 200) {
          let data = req.data
          return data
        }
      } catch (error) {
        return error
      }
  }