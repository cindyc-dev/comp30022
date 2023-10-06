import { Layout } from "~/components/layout/layout";
import { Board } from "./_board";

export default function Trello() {
  
  return (
    <Layout>
      <div className="flex w-full flex-col ">
        <Board />
      </div>
    </Layout>
  );
}

Trello.auth = true;
