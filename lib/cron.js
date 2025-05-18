import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/12 * * * *", () => {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("Success");
      else console.log("Error");
    })
    .on("error", (err) => {
      console.log("error sending req", err);
    });
});

export default job;
