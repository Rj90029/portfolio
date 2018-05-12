using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Portfolio.Models.Home
{
    public class SendMail
    {   [Required(AllowEmptyStrings =false,ErrorMessage ="Required Field*")]
        public string Firstname { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "Required Field*")]
        public string LastName { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "Required Field*")]
        public string From { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "Required Field*")]
        public string To { get; set; }
        [DataType(DataType.PhoneNumber)]
        public string Phone { get; set; }
        [Required(AllowEmptyStrings =false,ErrorMessage ="Please write some message!")]
        public string Message { get; set; }
    }
}