# curl --location --request POST 'https://dev-or.us.auth0.com/oauth/token' \
# --header 'Content-Type: application/x-www-form-urlencoded' \
# --data-urlencode 'client_id=NcpsytQUgK1KdL7dZAId6j6DkrdWUEnN' \
# --data-urlencode 'username=sylvan0212@gmail.com' \
# --data-urlencode 'password=Password123!@#' \
# --data-urlencode 'grant_type=password' \
# --data-urlencode 'scope=openid'


npx ts-node codes/lambda/src/Auction/auth/index.ts