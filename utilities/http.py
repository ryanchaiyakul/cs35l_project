##############################
## AIOHTTP HELPER FUNCTIONS ##
##############################
import aiohttp
class Utils:
    def __init__(self):
        pass

    async def query(self, url, method="get", res_method="text", *args, **kwargs):
        session = aiohttp.ClientSession()
        async with getattr(session, method.lower())(url, *args, **kwargs) as res:
            if res.status == 204:
                return None  # No content
            try:
                res = await getattr(res, res_method)()
            except:
                res = await getattr(res, "text")()
        await session.close()
        return res

    async def get(self, url, *args, **kwargs):
        return await self.query(url, "get", *args, **kwargs)

    async def post(self, url, *args, **kwargs):
        return await self.query(url, "post", *args, **kwargs)

    async def put(self, url, *args, **kwargs):
        return await self.query(url, "put", *args, **kwargs)

    async def patch(self, url, *args, **kwargs):
        return await self.query(url, "patch", *args, **kwargs)
