import Breadcrumb from '../components/Breadcrumbs/Breadcrumb.jsx';

import TableTwo from '../components/Tables/Suppliers.jsx';


const Profile = () => {
  return (
    <>
      <Breadcrumb pageName="Suppliers" />

      <div className="flex flex-col gap-10">
        
        <TableTwo />
        
      </div>
    </>
  );
};

export default Profile;
