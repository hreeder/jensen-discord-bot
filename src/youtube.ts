import { Channel, TextChannel, Role } from "discord.js";
import { CommandoClient } from "discord.js-commando";
import * as search from "youtube-search"
import chalk from "chalk";

interface ChannelMapping {
  channelID: string,
  filter: string,
  roleID: string,
  outputChannel: string
}

const CHANNELS: Array<ChannelMapping> = [
  // Hermitcraft
  { channelID: "UClu2e7S8atp6tG2galK9hgg", filter: "hermitcraft", roleID: "648281907683131402", outputChannel: "648507447077765131" }, // BdoubleO100
  { channelID: "UC9lJXqw4QZw-HWaZH6sN-xw", filter: "hermitcraft", roleID: "648282002180538414", outputChannel: "648507447077765131" }, // cubfan135
  { channelID: "UC4O9HKe9Jt5yAhKuNv3LXpQ", filter: "hermitcraft", roleID: "648282034304712744", outputChannel: "648507447077765131" }, // docm77
  { channelID: "UCuQYHhF6on6EXXO-_i_ClHQ", filter: "hermitcraft", roleID: "648282061618020373", outputChannel: "648507447077765131" }, // FalseSymmetry
  { channelID: "UCR9Gcq0CMm6YgTzsDxAxjOQ", filter: "hermitcraft", roleID: "648282098079367178", outputChannel: "648507447077765131" }, // Grian
  { channelID: "UCuMJPFqazQI4SofSFEd-5zA", filter: "hermitcraft", roleID: "648282127124922374", outputChannel: "648507447077765131" }, // impulseSV
  { channelID: "UCZ9x-z3iOnIbJxVpm1rsu2A", filter: "hermitcraft", roleID: "648282239695847464", outputChannel: "648507447077765131" }, // iskall85
  { channelID: "UCrEtZMErQXaSYy_JDGoU5Qw", filter: "hermitcraft", roleID: "648282266736525349", outputChannel: "648507447077765131" }, // ijevin
  { channelID: "UCtWObtiLCNI_BTBHwEOZNqg", filter: "hermitcraft", roleID: "648282298017644565", outputChannel: "648507447077765131" }, // JoeHillsTSD
  { channelID: "UCcJgOennb0II4a_qi9OMkRA", filter: "hermitcraft", roleID: "648282334201905160", outputChannel: "648507447077765131" }, // Keralis
  { channelID: "UChFur_NwVSbUozOcF_F2kMg", filter: "hermitcraft", roleID: "648282381849198614", outputChannel: "648507447077765131" }, // Mumbo Jumbo
  { channelID: "UCDpdtiUfcdUCzokpRWORRqA", filter: "hermitcraft", roleID: "648282415193653268", outputChannel: "648507447077765131" }, // rendog
  { channelID: "UCodkNmk9oWRTIYZdr_HuSlg", filter: "hermitcraft", roleID: "648282473633021992", outputChannel: "648507447077765131" }, // GoodTimesWithScar
  { channelID: "UC24lkOxZYna9nlXYBcJ9B8Q", filter: "hermitcraft", roleID: "648282499151167548", outputChannel: "648507447077765131" }, // Stressmonster101
  { channelID: "UC4YUKOBld2PoOLzk0YZ80lw", filter: "hermitcraft", roleID: "648282564217536519", outputChannel: "648507447077765131" }, // Tango Tek
  { channelID: "UCRatys97ggrXVtQQBGRALkg", filter: "hermitcraft", roleID: "648282671444787201", outputChannel: "648507447077765131" }, // TinfoilChef's Gaming Channel
  { channelID: "UCU9pX8hKcrx06XfOB-VQLdw", filter: "hermitcraft", roleID: "648282705137500191", outputChannel: "648507447077765131" }, // xisumavoid
  { channelID: "UCPK5G4jeoVEbUp5crKJl6CQ", filter: "hermitcraft", roleID: "648282740835221513", outputChannel: "648507447077765131" }, // ZedaphPlays
  { channelID: "UCjI5qxhtyv3srhWr60HemRw", filter: "hermitcraft", roleID: "648282791875706908", outputChannel: "648507447077765131" }, // ZombieCleo
]

export class YouTube {
  private lastChecked: Date;
  private discord: CommandoClient

  constructor(client: CommandoClient) {
    this.lastChecked = new Date(Date.now())
    console.log(chalk.yellow("YouTube:") + `Set LastChecked to ${this.lastChecked}`)

    this.discord = client
  }

  check(): void {
    console.log(chalk.yellow("YouTube:") + `Check Starting. LastChecked? ${this.lastChecked}`)
    const baseOpts: search.YouTubeSearchOptions = {
      key: process.env.YOUTUBE_API_KEY,
      type: "video",
      order: "date",
      publishedAfter: this.lastChecked.toISOString()
    }

    CHANNELS.forEach(mapping => {
      search(mapping.filter, { ...baseOpts, channelId: mapping.channelID }, (err: Error, results?: search.YouTubeSearchResults[] | undefined) => {
        if (err) {
          console.log(results)
          console.log(chalk.red("ERROR:") + `${err}`)
          return
        }

        if (results === undefined || results.length === 0) return
        const filtered = results.filter(result => result.title.toLowerCase().indexOf(mapping.filter) >= 0)
        if (filtered.length === 0) return

        const _channel: Channel | undefined = this.discord.channels.get(mapping.outputChannel)
        if (_channel === undefined) {
          console.log(chalk.red("ERROR:") + `Unable to locate channel ${mapping.outputChannel}`)
          return
        }
        const channel: TextChannel = _channel as TextChannel

        const role: Role | undefined = channel.guild.roles.get(mapping.roleID)
        if (role === undefined) {
          console.log(chalk.red("ERROR:") + `Unable to locate role ${mapping.roleID}`)
          return
        }

        const plurality = (results.length > 1) ? "new videos" : "a new video"

        let message = `Hey ${role}: There's ${plurality} for you to watch`

        results.forEach(result => message += ` ${result.link}`)

        channel.send(message)
      })
    });

    this.lastChecked = new Date(Date.now())
  }
}