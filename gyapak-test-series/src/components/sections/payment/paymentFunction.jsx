import { createOrder,verifyPayment} from "../../../service/payment.service";
import { invoiceEmail } from "../../../service/email.service";
const generateReceipt = (userId) => {

        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
        const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS
        return `${formattedDate}${formattedTime}${userId}`;
};        

 const paymentComponent=async (data) => {
    try{
        console.log("Payment data:",data);
    if(!data.user) {
        alert("Please login to continue with payment");
        return({status:401, message:"User not logged in", data:null});
    };
    if(data.pricing.amount == null || isNaN(data.pricing.amount) || data.pricing.amount < 0){
        console.log("Invalid amount");
        return {status:400,message:"Invalid amount"};
    };
    const payload={
        receipt: generateReceipt(data.user._id),
        testData:[{testId:data.examId,
            testModel:data.planType
        }],
        amount:data.pricing.amount,
        finalTotal:data.pricing.amount,
    }
    let response=await createOrder(payload);
    const order=response.data.order;
    if(!order.id){
        return {status:400,message:"Error in creating order"};
     }

     let emailData={};

     if(data.pricing.amount===0){

        emailData={
            data:payload,
            testName:payload.testData,
            payment:response.data.payment
        };
        const emailResponse=await invoiceEmail(emailData);  
        if(emailResponse.status!==200){

         return {status:200,message:"Payment successfull",payment:{_id:response.data.payment}, updatedUser: response.data.updatedUser};
        }
        else{
            return {status:200,message:"Payment successfull and email sent successfully",payment:{_id:response.data.payment}, updatedUser: response.data.updatedUser};
        }
     }else{
        return new Promise((resolve,reject)=>{
            const options={
                // key:RAZORPAY_KEY_ID,
                key:'rzp_test_gyUCnSq8cEqIfB',
                amount:data.pricing.amount,
                currency:order.currency,
                name:"Gyapak-TestSeries",
                description:"Insansa Techknowledge",
                order_id:order.id,
                handler: async function(response){
                    const paymentData={
                        paymentId:order.payment_Id,
                        razorpay_payment_id:response.razorpay_payment_id,
                        razorpay_order_id:response.razorpay_order_id,
                        razorpay_signature:response.razorpay_signature
                    };
                    try{
                    response=await verifyPayment(paymentData);
                    if(response.status===200){
                        emailData={
                            data:payload,
                            testName:payload.testData,
                            payment:response.data.payment
                        };
                        const emailResponse=await invoiceEmail(emailData);
                        if(emailResponse.status!==200){

                            resolve({status:response.status,message:"Payment successfull",payment:response.data.payment, updatedUser: response.data.updatedUser});
                        }
                        else{
                            resolve({status:response.status,message:"Payment successfull and email sent successfully",payment:response.data.payment, updatedUser: response.data.updatedUser});
                        }
                    }
                    else{
                        
                        resolve ({status:response.status,message:"Payment failed"});
                    }
                }catch(error){
                    console.error("Error verifying payment:", error);
                    reject(error);
                }
                },
                prefill:{
                    name:data.user.fullName,
                    email:data.user.email,
                    // contact:data.user.phone
                },
                theme:{
                    color:"#7c45a1"
                },
                image: `${window.location.origin}/assets/react.svg`,        
                method: {
                        upi: true,    // Enable UPI payments
                        card: false,  // Disable Card payments
                        netbanking: false, // Disable Net Banking
                        wallet: false, // Disable Wallets,
                        EMI: false, // Disable EMI payments,
                        paylater: false, // Disable Pay Later option
                    },
                modal: {
                    ondismiss: function () {
                        console.log("Razorpay window closed by user.");
                        resolve({status:400,message:"Payment process was closed by the user"});
                    }
                }, // Optional callback URL

            };
            const rzp1=Razorpay(options);
            rzp1.open();

        })
     };


}catch(err){
    console.error("Error in paymentComponent:", err);
    
}
}

export default paymentComponent;