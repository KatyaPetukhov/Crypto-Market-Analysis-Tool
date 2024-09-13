import React, { useEffect, useState } from "react";
import Chart from "../features/Chart";
import Prediction from "../features/Prediction";
import Subscribe from "../components/Subscribe";
import Alert from "../components/Alert";
import { useParams } from "react-router-dom";
import { log } from "console";
import { usePostRemoveSubscriberMutation } from "../redux/Api";

const Home = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { mail } = useParams();
  //console.log("THE MAIL IS : " + mail);
  useEffect(() => {
    if (mail !== undefined) setIsAlertOpen(true);
  }, [mail]);
  const [unsubscribeFunc] = usePostRemoveSubscriberMutation();
  return (
    <div>
      <Chart></Chart>
      <Prediction></Prediction>
      <Alert
        type={"warn"}
        onClickCancel={function (): void {
          setIsAlertOpen(!isAlertOpen);
        }}
        onClickAction={function (): void {
          unsubscribeFunc({
            mail: mail,
          })
            .unwrap()
            .then(() => {
              setIsAlertOpen(!isAlertOpen);
            })
            .catch((e) => {
              console.log(e);
            });
        }}
        text={`This will remove ${mail} from the mailing list.`}
        title={"Are you sure that you want to unsubscribe?"}
        isOpen={isAlertOpen}
      ></Alert>
      <Subscribe></Subscribe>
    </div>
  );
};

export default Home;
