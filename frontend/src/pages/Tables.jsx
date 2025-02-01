import Breadcrumb from '../components/Breadcrumbs/Breadcrumb.jsx';
import TableOne from '../components/Tables/Orders';
import TableThree from '../components/Tables/Inventory';
import TableTwo from '../components/Tables/Suppliers';
import TableFour from '../components/Tables/Logistics';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Orders" />

      <div className="flex flex-col gap-10">
        <TableOne />
      </div>
    </>
  );
};

export default Tables;
