import { Layout } from "~/components/layout/layout";
import Board from "~/components/board";


export default function Trello() {
  return (
    <Layout>
      <h1>Trello</h1>
      <Board/>
    </Layout>
  );
}



Trello.auth = false;