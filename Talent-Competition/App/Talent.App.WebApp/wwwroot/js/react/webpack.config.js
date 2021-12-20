
module.exports = {
    context: __dirname,
    entry: {
        homePage: './ReactScripts/Home.js',
        accountProfile: './ReactScripts/AccountProfile.js',
        employerFeed: './ReactScripts/EmployerFeed.js',
        employerJob: './ReactScripts/EmployerJob.js',
        employerManageJob: './ReactScripts/EmployerManageJob.js',
        employerProfile: './ReactScripts/EmployerProfile.js',
        // listingManagement: './ReactScripts/ListingManagement.js',
        resetPassword: './ReactScripts/ResetPassword.js',
        // searchResult: './ReactScripts/SearchResult.js',
        // serviceDetail: './ReactScripts/ServiceDetail.js',
        // serviceListing: './ReactScripts/ServiceListing.js',
        talentDetail: './ReactScripts/TalentDetail.js',
        talentFeed: './ReactScripts/TalentFeed.js',
        talentMatching: './ReactScripts/TalentMatching.js',
        talentWatchlist: './ReactScripts/TalentWatchlist.js',
        userAccountSetting: './ReactScripts/UserAccountSetting.js',
        userSettings: './ReactScripts/UserSettings.js'
    },
    output:
    {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    watch: true,
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env', 'babel-preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules'
                ]
            }
        ]
    }
}