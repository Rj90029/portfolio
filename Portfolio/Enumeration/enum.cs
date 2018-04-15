using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace Portfolio.Enumeration
{
    public class Enum
    {
        public enum Subjects
        {
            [Description("Data Structures")]
            DS = 0,
            [Description("Algorithms")]
            Algorithms=1
        }
    }
}