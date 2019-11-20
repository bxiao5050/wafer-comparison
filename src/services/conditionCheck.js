/**
 * Created by linlin.zhang on 2017/11/28.
 */
import moment from 'moment'
class iChcek {
  /**
   * 条件判断
   * @param type 类型  ： 奖励 、 活动
   * @param conditionInfo  奖励信息
   * @returns {boolean}  是否校验通过
   */
  conditionCheck(type, conditionInfo) {
    return true;
  }
}


class actionInfoCheck extends iChcek {
  conditionCheck(type, conditionInfo) {
    //检查结束时间是否大于开始时间
    var start = new Date(conditionInfo.conditionInfo.start);
    var end = new Date(conditionInfo.conditionInfo.end);
    if (start.after(end)) {
      return false;
    }

  }
}

/**
 * 参与次数限制
 */
class joinTimeLimitCheck extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (
      conditionInfo.sumTime === "" ||
      conditionInfo.dayTime === ""
    ) {
      return false;
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        sumTime: conditionInfo.sumTime,
        dayTime: conditionInfo.dayTime
      }
    };
    return {
      result: true,
      msg: "success",
      data: obj
    };
  }
}

/**
 * 游戏登陆
 */
class gameLoginConditionCheck extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (!conditionInfo.start || !conditionInfo.end || conditionInfo.start > conditionInfo.end) {
      return {
        result: false,
        msg: "游戏登陆时间配置异常"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        activeLoginType: conditionInfo.activeLoginType,
        loginType: conditionInfo.loginType,
        start: moment(conditionInfo.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(conditionInfo.end).format('YYYY-MM-DD HH:mm:ss')
      }
    };
    if (conditionInfo.loginType != 1) {
      obj.condition.LoginCount = conditionInfo.LoginCount;
    }
    return { result: true, msg: "success", data: obj };
  }
}

/**
 * 关联消耗
 */
class resourceConnectionCheck extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (!conditionInfo.ActivityId || conditionInfo.count === "") {
      return {
        result: false,
        msg: "未关联活动或未配置消耗数量"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        ActivityId: conditionInfo.ActivityId,
        type: conditionInfo.type,
        count: conditionInfo.count
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}
/**
 * 内定玩家条件配置
 */
class onlyUserConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.thirdGameZoneId === "" ||
      conditionInfo.userId === "") {
      return {
        result: false,
        msg: "未配置用户id或区服id"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        thirdGameZoneId: conditionInfo.thirdGameZoneId,
        userId: conditionInfo.userId
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}
/**
 * 充值条件
 */
class chargeLimitConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (
      conditionInfo.chargeMoneny === ""
    ) {
      return {
        result: false,
        msg: "充值条件未配置"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        changeType: conditionInfo.changeType,
        chargeMoneny: conditionInfo.chargeMoneny
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

/**
 * 消耗条件
 */
class comsumeLimitConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (
      conditionInfo.chargeMoneny === ""
    ) {
      return {
        result: false,
        msg: "消费条件未配置"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        changeType: conditionInfo.changeType,
        chargeMoney: conditionInfo.chargeMoney
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}
/**
 * 等级条件
 */
class levelLimitConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (
      conditionInfo.level === ""
    ) {
      return {
        result: false,
        msg: "等级条件未配置"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        level: conditionInfo.level
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

/**
 * 指定天数可以领取
 */
class overDayLimitConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.OverDate === "") {
      return {
        result: false,
        msg: "未配置指定天数"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        OverDate: conditionInfo.OverDate
      }
    };
    return { result: true, msg: "success", data: obj };

  }
}

/**
 * 达到指定活跃人数可以领取
 */
class joinCountConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.limitCount === "") {
      return {
        result: false,
        msg: "未配置活跃人数"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        limitCount: conditionInfo.limitCount
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

/**
 * 指定区服可以领取
 */
class gameZoneLimitConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.gameZoneLimit === "") {
      return {
        result: false,
        msg: "未配置区服限制"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        gameZoneLimit: conditionInfo.gameZoneLimit
      }
    };
    return { result: true, msg: "success", data: obj };

  }
}


/**
 * 达到在线时长条件
 */
class onlineTimeConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    // 在线时长
    if (conditionInfo.onlineTime === "") {
      return {
        result: false,
        msg: "未配置在线时间限制"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        onlineTime: conditionInfo.onlineTime
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

/**
 * 受邀人条件
 */
class inviteConditionChecker extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.invitedCount === "") {
      return {
        result: false,
        msg: "未配置受邀人数量"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        isInvited: conditionInfo.isInvited,
        invitedCount: conditionInfo.invitedCount
      }
    };
    return { result: true, msg: "success", data: obj };

  }
}
/**
 * 参与人数限制
 */
class joinCountLimit extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (
      conditionInfo.sumCount === "" ||
      conditionInfo.joinCountDays === ""
    ) {
      return {
        result: false,
        msg: "未配置参与人数数量限制"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        sumCount: conditionInfo.sumCount,
        joinCountDays: conditionInfo.joinCountDays,
        type: conditionInfo.type
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

/**
 * 预注册限制
 */
class preRegistryLimit extends iChcek {
  conditionCheck(type, conditionInfo) {
    // 预注册
    if (conditionInfo.type == "") {
      return {
        result: false,
        msg: "未选择预注册收集类型"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        type: conditionInfo.type,
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

class ticketConditionLimit extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.ticketCount === "") {
      return {
        result: false,
        msg: "未配置竞猜数量"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        ticketCount: conditionInfo.ticketCount,
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

/**
 * 受邀人条件
 */
class InviteCondition extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.isInvited === "" || conditionInfo.invitedCount == "") {
      return {
        result: false,
        msg: "受邀人条件配置错误"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        isInvited: conditionInfo.isInvited,
        invitedCount: conditionInfo.invitedCount
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}
/**
 * 统计人数
 */
class countTimeCondition extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.baseCount === "" || conditionInfo.randomCount === "") {
      return {
        result: false,
        msg: "统计人数条件配置错误"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        baseCount: conditionInfo.baseCount,
        randomCount: conditionInfo.randomCount
      }
    }
      ;
    return { result: true, msg: "success", data: obj };
  }
}

class FixUserCondition extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.importId === "") {
      return {
        result: false,
        msg: "固定玩家条件配置错误"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        importId: conditionInfo.importId
      }
    }
      ;
    return { result: true, msg: "success", data: obj };
  }
}

class TicketCondition extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.steps && conditionInfo.steps.length <= 0) {
      return {
        result: false,
        msg: "竞猜条件配置错误"
      };
    }

    let steps = [];
    let isError = false;
    let message = "";
    conditionInfo.steps.forEach((item) => {
      var start = moment(item.startTime), end = moment(item.endTime), pub = moment(item.publicTime);
      if (start > end) {
        isError = true;
        message = "竞猜结束时间必须大于开始时间";
        return false;
      }
      if (start > pub) {
        isError = true;
        message = "竞猜公布时间必须大于开始时间";
        return false;
      }
      steps.push({
        allowCount: item.allowCount,
        systemCount: item.systemCount,
        startTime: start.format('YYYY-MM-DD HH:mm:ss'),
        endTime: end.format('YYYY-MM-DD HH:mm:ss'),
        publicTime: pub.format('YYYY-MM-DD HH:mm:ss')
      })
    });
    if (isError) {
      return {
        result: false,
        msg: message
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        steps: steps
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

class JoinTimesLimitCondition extends iChcek {
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.steps && conditionInfo.steps.length <= 0) {
      return {
        result: false,
        msg: "竞猜条件配置错误"
      };
    }

    let steps = [];
    let isError = false;
    let message = "";
    conditionInfo.steps.forEach((item) => {
      var start = moment(item.startTime), end = moment(item.endTime), pub = moment(item.publicTime);
      if (start > end) {
        isError = true;
        message = "竞猜结束时间必须大于开始时间";
        return false;
      }
      if (start > pub) {
        isError = true;
        message = "竞猜公布时间必须大于开始时间";
        return false;
      }
      steps.push({
        allowCount: item.allowCount,
        systemCount: item.systemCount,
        startTime: start.format('YYYY-MM-DD HH:mm:ss'),
        endTime: end.format('YYYY-MM-DD HH:mm:ss'),
        publicTime: pub.format('YYYY-MM-DD HH:mm:ss')
      })
    });
    if (isError) {
      return {
        result: false,
        msg: message
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        steps: steps
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

class gameTaskCondition extends iChcek{
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.changev==='' && conditionInfo.achieveValue==='') {
      return {
        result: false,
        msg: "游戏任务积分条件配置错误"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        operatorId: conditionInfo.operatorId,
        toolsId: conditionInfo.toolsId,
        type: conditionInfo.type,
        logic: conditionInfo.logic,
        changev: conditionInfo.changev,
        achieveValue: conditionInfo.achieveValue,
        calcWay: conditionInfo.calcWay,
        dateType: conditionInfo.dateType,
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

class voteUpload extends iChcek{
  conditionCheck(type, conditionInfo) {
    if (conditionInfo.resourceId==='') {
      return {
        result: false,
        msg: "投票条件配置错误"
      };
    }
    let obj = {
      conditionId: conditionInfo.conditionId, //item.conditionId,
      hasResource: false, //item.hasResource,
      condition: {
        resourceId: conditionInfo.resourceId,
      }
    };
    return { result: true, msg: "success", data: obj };
  }
}

var conditionMap = {
  "4b90b47a-2dbe-4b67-a261-8811a70faeec": new joinTimeLimitCheck(),
  "c89101da-32d5-49aa-8136-421cee9bb822": new gameLoginConditionCheck(),
  "29a206ba-59db-4505-b2e2-7a7bc7e1fb5c": new resourceConnectionCheck(),
  "4a71353d-b195-46d4-a5ce-335778fa59fc": new onlyUserConditionChecker(),
  "2d0c5927-53af-4b95-b27e-209b84a4bd72": new chargeLimitConditionChecker(),
  "cbc307bf-ffc3-4122-978c-05442191f4bf": new comsumeLimitConditionChecker(),
  "c9d389b8-e8a2-48a5-ae91-5ef24e8bc8a7": new levelLimitConditionChecker(),
  "48d5f4a0-153e-49fd-ac3b-b5d8250714d3": new overDayLimitConditionChecker(),
  "9b0ad46c-6138-40aa-9a86-ea76c117dac1": new joinCountConditionChecker(),
  "c5ffb6b3-79b9-4a54-bdfe-d022b98423c3": new gameZoneLimitConditionChecker(),
  "97046173-2b9b-478b-8b4f-f81122150589": new onlineTimeConditionChecker(),
  "bb1963c6-454f-4b6b-b894-71ef9198469c": new inviteConditionChecker(),
  "66c3e106-f15c-4c1e-8e4b-94d53e66c738": new joinCountLimit(),
  "5d4b9651-d16d-40d2-a512-7c5c8a7c57a2": new preRegistryLimit(),
  "6710ab18-e933-411f-abfe-67b404193ba1": new ticketConditionLimit(),
  "3e15383b-634b-4e10-b3ff-6da94da573dd": new InviteCondition(),
  "5a13b590-8821-4fb5-a18e-9a10eeaeb2a1": new countTimeCondition(),
  "ce59f4f3-75c9-472b-bfe7-0280405df206": new FixUserCondition(),
  "a8888a60-54c4-4307-b68d-8dba3daa36b4": new TicketCondition(),
  "9dffc34c-72fa-4d48-b160-e05377be5446": new JoinTimesLimitCondition(),
  "f43bffe8-37af-4f78-bf79-6de2677717af": new gameTaskCondition(),
  "a4ded85d-69e3-4132-90d3-59dadc98312f": new voteUpload()
};

export default conditionMap;
