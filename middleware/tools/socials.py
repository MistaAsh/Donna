class Socials():
    """
    Middleware to handle account related requests
    """

    def check_social_followers(self, social_media, username):
        """
        Return the number of followers of the username on the social media platform
        """
        error, payload = False, {}
        try:
            pass
        except Exception as e:
            error = e
            print(e)