using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace AngularSpaPlusNetCoreBackend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class UploadFileController : ControllerBase
	{
		
		private readonly ILogger<UploadFileController> _logger;
		private readonly IMemoryCache cache;

		public UploadFileController(ILogger<UploadFileController> logger, IMemoryCache cache)
		{
			_logger = logger;
			this.cache = cache;
		}

		[HttpPost("")]
		public object UploadFile(string id)
		{
			var file = Request.Form.Files[0];
			//var id = Request.Query["id"];
			var stream = new MemoryStream();
			if (file.Length > 0)
			{
				file.CopyTo(stream);
				cache.Set(id, new UploadFile { Data = stream.ToArray(), name = file.FileName }, DateTime.Now.AddMinutes(5));
				return new[] {
					new {
						fieldname =  "file",
						originalname = file.FileName,
						destination = "/api/uploadfile",
						filename = file.FileName,
						path = "",
						size = file.Length
					}
				};
			}
			return null;

		}		
	}

	public class UploadFile
	{
		public byte[] Data { get; set; }
		public string name { get; set; }
	}
}
