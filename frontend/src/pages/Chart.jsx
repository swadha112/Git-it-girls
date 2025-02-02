import Breadcrumb from '../components/Breadcrumbs/Breadcrumb.jsx';

import TableFour from '../components/Tables/Logistics.jsx';

const Chart = () => {
  return (
    <>
      <Breadcrumb pageName="Location Predictor" />

      <div className="flex flex-col gap-10">
        <TableFour />
      </div>
    </>
  );
};

export default Chart;
