import styles from "../styles/Home.module.css";
import cheerio from "cheerio";
import axios from "axios";
import Head from "next/head";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { ClassNames } from "@emotion/react";

export default function Home(props) {
  function truncateString(str) {
    return str.slice(0, 300) + "...";
  }
  const rss = props.rss;
  return (
    <>
      <Head>
        <title>Internship Postings</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charset="UTF-8" />
        <meta name="description" content="Internship postings RSS" />
        <meta name="language" content="en" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <Typography className={styles.header} variant="h3">
        Internship Postings
      </Typography>
      <div className={styles.container}>
        {rss.map((data) => {
          return (
            <div className={styles.rssContainer} key={data.guid}>
              <Card style={{ border: "3px solid #1876D1" }}>
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {data.title}
                  </Typography>
                  <Typography variant="body1">
                    {truncateString(data.description)}
                  </Typography>
                  <br />
                  <Typography variant="subtitle2">{data.pubDate}</Typography>
                </CardContent>
                <CardActions>
                  <a href={data.link} target="_blank" rel="noreferrer noopener">
                    <Button size="small">More Info</Button>
                  </a>
                </CardActions>
              </Card>
            </div>
          );
        })}
      </div>
      <footer className={styles.footer}>
        <Typography variant="subtitle2">
          &copy; COPYRIGHT 2021{" "}
          <a
            style={{ textDecoration: "underline" }}
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.csi.cuny.edu/campus-life/student-services/center-career-and-professional-development"
          >
            Career Center
          </a>
        </Typography>
      </footer>
    </>
  );
}

export async function getStaticProps() {
  const { data } = await axios.get(
    "https://csicuny.joinhandshake.com/external_feeds/11996/public.rss?token=GgnRqTq3Y-1_GNMDY4kY4IlRgCRYgPO6nZPUPYSQoUfbq66RZTsUWA"
  );
  const $ = cheerio.load(data);
  const rss = [];
  let allItems = {};
  const items = $("item");
  items.each(function (idx, el) {
    allItems["title"] = $(el).find("title").text();
    allItems["guid"] = $(el).find("guid").text();
    allItems["description"] = $(el).find("description").text();
    allItems["pubDate"] = $(el).find("pubDate").text();
    allItems["link"] = $(el).find("link")["0"].prev.next.next.data.slice(0, -7);
    rss.push(allItems);
    allItems = {};
  });
  return {
    props: { rss },
    revalidate: 86400,
  };
}
