import * as fs from "fs";

class Packet {
  public version: number;
  public typeId: number;
  public packetContent: string;
  public packets: Packet[];
  public value?: number;
  public length?: number;

  constructor(public readonly rawString: String) {
    this.packets = [];
    this.version = parseInt(rawString.substr(0, 3), 2);
    this.typeId = parseInt(rawString.substr(3, 3), 2);
    this.packetContent = rawString.substr(6);
    this.parseRemaining();
  }

  public get sumOfVersion(): number {
    return (
      this.version +
      this.packets.reduce((acc, current) => acc + current.sumOfVersion, 0)
    );
  }

  parseRemaining() {
    if (this.typeId === 4) {
      this.buildValue();
    } else {
      if (this.packetContent.charAt(0) === "0") {
        this.buildAsKnownLengthPackets();
      } else {
        this.buildAsKnownNumberOfPackets();
      }
    }
  }

  private buildValue() {
    let valueAsArray = [];
    let start = 0;
    let indicatorBit = undefined;
    do {
      indicatorBit = this.packetContent.charAt(start);
      valueAsArray.push(this.packetContent.substr(start + 1, 4));
      start += 5;
    } while (indicatorBit !== "0");
    this.value = parseInt(valueAsArray.join(""), 2);
    this.length = start + 6;
  }

  private buildAsKnownLengthPackets() {
    const numberOfBitsForSubPackets = parseInt(
      this.packetContent.substr(1, 15),
      2
    );
    let totalLength = 0;
    const subPacketsRaw = this.packetContent.substr(16);
    while (totalLength < numberOfBitsForSubPackets) {
      const newPacket = new Packet(subPacketsRaw.substr(totalLength));
      this.packets.push(newPacket);
      totalLength += newPacket.length ?? 0;
    }
    this.length = totalLength + 22;
  }

  private buildAsKnownNumberOfPackets() {
    const numberOfSubPackets = parseInt(this.packetContent.substr(1, 11), 2);
    let totalLength = 0;
    const subPacketsRaw = this.packetContent.substr(12);
    while (this.packets.length < numberOfSubPackets) {
      const newPacket = new Packet(subPacketsRaw.substr(totalLength));
      this.packets.push(newPacket);
      totalLength += newPacket.length ?? 0;
    }
    this.length = totalLength + 18;
  }
}

function main_part1() {
  const inputString: string = fs.readFileSync("day_16/input.txt").toString();
  const inputAsBinaryString = inputString
    .split("")
    .map((char) => {
      const charAsNumber = parseInt(char, 16);
      const asBinary = charAsNumber.toString(2);
      return asBinary.padStart(4, "0");
    })
    .join("");

  const packet = new Packet(inputAsBinaryString);
  console.log(packet.sumOfVersion);
}

main_part1();
