# node-stripe-squarespace
One way to integrate custom stripe functionality into Squarespace

# Usage
Step 1: Add your public/secret stripe keys to index.js => stripeKeys
Step 2: Host the NodeJS app at [Heroku](https://www.heroku.com/) or any other hosting service
Step 3: Update the NODESERVICE variable in html/code.block to point to your NodeJS service. Also, update the KEYS there.
Step 4: Add a code block anywhere on your Squarespace site. Copy paste the code from html/code.block.
Step 5: Refresh and test. If things don't work, look at your console and network panel.