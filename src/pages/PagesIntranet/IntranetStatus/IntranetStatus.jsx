/*import styles*/
import "./IntranetStatus.css";

/*import components*/
import NavBarIntranet from "../../../components/Intranet/NavbarIntranet/NavBarIntranet";
import Status from '../../../components/Intranet/Status/Status';

/*import utils*/
import { formatFecha } from "../../../utils/formatFechas"

function IntranetStockDepot() {

  return (
    <>
      <NavBarIntranet />
      <main className='intranetPageContainer'>
        <div className='intranetPageTitle'> STATUS OPERACIONES {formatFecha(new Date())} </div>
      </main>
      <Status />
    </>

  )
}

export default IntranetStockDepot