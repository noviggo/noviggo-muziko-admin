import { CircularProgress } from "@material-ui/core";

export default function Loader() {
  return (
    <div className="container vh-100 d-flex">
      <div className="m-auto">
        <CircularProgress />
      </div>
    </div>
  );
}
