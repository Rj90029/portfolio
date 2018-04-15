using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Portfolio.Enumeration;
using Portfolio.Models.Home;
using Portfolio.Common;

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
        
    }
}