using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Portfolio.Enumeration;
using Portfolio.Models.Home;
using Portfolio.Common;
using System.Net.Mail;
using System.Net;
using System.Threading;
using System.IO;

namespace Portfolio.Controllers.Home
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Home()
        {
            return View();
        }
        public ActionResult About()
        {
            return View();
        }
        public ActionResult Resume()
        {
            return View();
        }
        public ActionResult Projects()
        {
            return View();
        }
        [HttpPost]
        public ActionResult ContactMe(SendMail mail)
        {
           
                var tEmail = new Thread(() => SendMail(mail));
                tEmail.Start();
                return RedirectToAction("Home");
           
        }

        public FileResult DownLoad()
        {
            string fileName = Directory.GetFiles(Server.MapPath("~/App_Data"))[0].ToString();
            string contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            return File(fileName, contentType, "Resume.docx");
        }

        public void SendMail(SendMail sendmail)
        {
            try
            {
                using (var mail = new MailMessage())
                {
                    const string email = "sendrj90029mail@gmail.com";
                    const string password = "Newpwd@123";

                    var loginInfo = new NetworkCredential(email, password);


                    mail.From = new MailAddress(sendmail.From);
                    mail.To.Add(new MailAddress(email));
                    mail.To.Add("rj90029@gmail.com");
                    mail.CC.Add(sendmail.From);
                    mail.Subject = sendmail.Firstname + " " + sendmail.LastName+" " + "Contacting";
                    mail.Body = sendmail.Message;
                    mail.IsBodyHtml = true;

                    try
                    {
                        using (var smtpClient = new SmtpClient(
                                                         "smtp.gmail.com", 587))
                        {
                            smtpClient.EnableSsl = true;
                            smtpClient.UseDefaultCredentials = false;
                            smtpClient.Credentials = loginInfo;
                            smtpClient.Send(mail);
                        }

                    }

                    finally
                    {
                        //dispose the client
                        mail.Dispose();
                    }

                }
            }
            catch (SmtpFailedRecipientsException ex)
            {
                foreach (SmtpFailedRecipientException t in ex.InnerExceptions)
                {
                    var status = t.StatusCode;
                    if (status == SmtpStatusCode.MailboxBusy ||
                        status == SmtpStatusCode.MailboxUnavailable)
                    {
                        Response.Write("Delivery failed - retrying in 5 seconds.");
                        System.Threading.Thread.Sleep(5000);
                        //resend
                        //smtpClient.Send(message);
                    }
                    else
                    {
                        Response.Write("Failed to deliver message to");
                    }
                }
            }
            catch (SmtpException Se)
            {
                // handle exception here
                Response.Write(Se.ToString());
            }

            catch (Exception ex)
            {
                Response.Write(ex.ToString());
            }
        }
        
    }
}