export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', // "Apr", "Jan", etc.
      year: 'numeric' // Full year "2025"
    }).replace(',', '').replaceAll('/','-'); // Remove comma if any
  };

  export const dateFormat = (date)=>{
    //Input: yyyy-mm-dd 
    //Output: dd--mm--yyyy;

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  }