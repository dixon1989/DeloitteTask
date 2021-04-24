import axios from "axios";

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