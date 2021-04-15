var axios = require('axios');
var cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config();
//SendGrid Email Integration
const SENDGRID_APY_KEY = process.env.SENDGRID_APY_KEY
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_APY_KEY);
const emailFrom = process.env.EMAIL_FROM;
const emailsToAlert = ['abc@abc.com'];

(async () => {
    const url = "https://vaccination.southcityhospital.org/pages/announcement";

    try {
        const response = await axios.get(url);
        let $ = cheerio.load(response.data);
        console.log('party');
        const vaccineMessage = $('#MainContent .rte')[0].children[3].children[0].children[0].data;
        console.log(vaccineMessage);
        if (vaccineMessage == 'All slots are booked for now! New schedule will be uploaded soon on the portal!') {
            return false;
        }
        else {
            //sendEmail here
            const msg = {
                to: emailsToAlert,
                from: emailFrom,
                subject: `🔥🔥🔥 Change detected in ${url} 🔥🔥🔥`,
                html: `Change detected in <a href="${url}"> ${url} </a><p>Check for Vaccine updated.</p>  `,
            };
            sgMail.send(msg)
                .then(() => { console.log("Alert Email Sent!"); })
                .catch((emailError) => { console.log(emailError); });

        }

    }
    catch (error) {
        //sendEmail hear;
        const msg = {
            to: emailsToAlert,
            from: emailFrom,
            subject: `🔥🔥🔥 Change detected in ${url} 🔥🔥🔥`,
            html: `Change detected in <a href="${url}"> ${url} </a><p>Check for updates on vaccine page.</p>  `,
        };
        sgMail.send(msg)
            .then(() => { console.log("Alert Email Sent!"); })
            .catch((emailError) => { console.log(emailError); });
        console.log(error);
    }

})();