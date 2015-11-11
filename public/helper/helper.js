function PagerBar(recordcount, pagesize, pageindex, showpagecount) { 
    var NumberRegex = new RegExp(/^d+$/); 
    this.PageIndex = 1; //页索引，当前页 
    if (pageindex != null && NumberRegex.test(pageindex)) this.PageIndex = parseInt(pageindex); 
    this.PageSize = 10; //页面大小 
    if (pagesize != null && NumberRegex.test(pagesize)) this.PageSize = parseInt(pagesize); 
    this.RecordCount = 0; 
    if (recordcount != null && NumberRegex.test(recordcount)) this.RecordCount = parseInt(recordcount); //记录总数 
    this.PageCount = 0;  //页总数 
    var PagerBar = this; 
    function CalculatePageCount(_pagesize, _recordcount) {//计算总页数 
        if (_pagesize != null && NumberRegex.test(_pagesize)) PagerBar.PageSize = parseInt(_pagesize); 
        if (_recordcount != null && NumberRegex.test(_recordcount)) PagerBar.RecordCount = parseInt(_recordcount); 
        else PagerBar.RecordCount = 0; 
        if (PagerBar.RecordCount % PagerBar.PageSize == 0) {//计算总也页数 
            PagerBar.PageCount = parseInt(PagerBar.RecordCount / PagerBar.PageSize); 
        } 
        else { 
            PagerBar.PageCount = parseInt(PagerBar.RecordCount / PagerBar.PageSize) + 1; 
        } 
    } 
    if (this.RecordCount != 0) {//如果传入了记录总数则计算总页数 
        CalculatePageCount(this.PageSize, this.RecordCount); 
    } 
    this.ReplaceString = "《#PageLink》"; //替换页数的文本，注：不可以有正则表达式中的符号 
    this.ShowPagesCount = 5; //显示页数量 
    if (showpagecount != null && NumberRegex.test(showpagecount.toString())) this.ShowPagesCount = parseInt(showpagecount); 
    this.PreviouBarFormat = ""; //上一页显示文本格式 
    this.IsShowPreviouString = true; //是否显示上一页 
    this.NextBarFormat = ""; //下一页显示文本格式 
    this.IsShowNextString = true; //是否显示下一页 
    this.PageBarFormat = ""; //页面连接显示文本格式 
    this.CurrentBarFormat = ""; //当前页显示文本格式 
    this.IsShowPageString = true; //是否显示页索引 
    this.FristBarFormat = ""; //首页链接显示文本格式 
    this.IsShowFristString = true; //是否显示首页 
    this.LastBarFormat = ""; //尾页显示文本格式 
    this.IsShowLastString = true; //是否显示尾页 
    this.CurrentRecordBarFormat = "当前记录{0}-{1}"; //当前记录显示文本格式 
    this.IsShowCurrentRecordString = true; //是否显示当前记录 
    this.CurrentPageBarFormat = "当前第" + this.ReplaceString + "页，共" + (this.PageCount == 0 ? 1 : this.PageCount) + "页"; //当前页文字说明文本格式 
    this.IsShowCurrentPageString = true; //是否显示当前页文字说明文本 
    this.OtherBarFormat = ""; //其他也显示文本 
    this.IsShowOtherString = true; //是否显示其它页文本 
    var regexp = new RegExp(this.ReplaceString, "g"); //替换页数文本正则表达式 
    function GetFristPageString() {//获取首页文本 
        if (PagerBar.FristBarFormat != "" && PagerBar.PageIndex != 1) { 
            return PagerBar.FristBarFormat.replace(regexp, 1); 
        } 
        else { 
            return ""; 
        } 
    } 
    function GetPreviouPageString() { //获取上一页文本 
        if (PagerBar.PreviouBarFormat != "") { 
            if (PagerBar.RecordCount > PagerBar.PageSize && PagerBar.PageIndex != 1) {//上一页HTML输出 
                return PagerBar.PreviouBarFormat.replace(regexp, PagerBar.PageIndex - 1); 
            } 
            else { 
                return ""; 
            } 
        } 
        else { 
            return ""; 
        } 
    } 
    function GetPageString() {//获取中间页数链接 
        var pagestr = ""; 
        if (PagerBar.CurrentBarFormat != "" && PagerBar.PageBarFormat != "") { 
            var ShowPageFirest = PagerBar.PageIndex - parseInt(PagerBar.ShowPagesCount / 2 + 1) < 0 ? 0 : PagerBar.PageIndex - parseInt(PagerBar.ShowPagesCount / 2 + 1); //计算显示页数的其实页数 
            if (PagerBar.PageCount < PagerBar.ShowPagesCount) {//当也总数小于显示页数量 
                ShowPageFirest = 0; 
            } 
            else { 
                if (PagerBar.PageIndex > (PagerBar.PageCount - parseInt(PagerBar.ShowPagesCount / 2 + 1))) {//当页总数在后几页显示 
                    ShowPageFirest = PagerBar.PageCount - PagerBar.ShowPagesCount; 
                } 
            } 
            for (var i = ShowPageFirest; i < ShowPageFirest + PagerBar.ShowPagesCount; i++) {//循环出书页数文本 
                if (PagerBar.PageIndex == i + 1) { 
                    pagestr += PagerBar.CurrentBarFormat.replace(regexp, i + 1); 
                } 
                else { 
                    pagestr += PagerBar.PageBarFormat.replace(regexp, i + 1); 
                } 
                if (i >= PagerBar.PageCount - 1) {//当到达页总数的时候挑出循环 
                    break; 
                } 
            } 
        } 
        return pagestr; 
    } 
    function GetNextPageString() {//获取下一页链接 
        if (PagerBar.NextBarFormat != "") { 
            if (PagerBar.RecordCount > PagerBar.PageSize && PagerBar.PageIndex != PagerBar.PageCount) {//输出下一页HTMl 
                return PagerBar.NextBarFormat.replace(regexp, PagerBar.PageIndex + 1); 
            } 
            else { 
                return ""; 
            } 
        } 
        else { 
            return ""; 
        } 
    } 
    function GetLastPageString() {//获取尾页链接 
        if (PagerBar.LastBarFormat != "" && PagerBar.PageIndex != PagerBar.PageCount && PagerBar.RecordCount != 0) { 
            return PagerBar.LastBarFormat.replace(regexp, PagerBar.PageCount); 
        } 
        else { 
            return ""; 
        } 
    } 

    function GetFrontOtherPageString() {//获取前其它页链接 
        if (PagerBar.OtherBarFormat != "") { 
            if (PagerBar.PageIndex > PagerBar.ShowPagesCount / 2 + 1) { 
                return PagerBar.OtherBarFormat.replace(regexp, PagerBar.PageIndex - PagerBar.ShowPagesCount <= 0 ? 1 : PagerBar.PageIndex - PagerBar.ShowPagesCount) 
            } 
            else { 
                return ""; 
            } 
        } 
        else { 
            return ""; 
        } 
    } 
    function GetAfterOtherPageString() {//获取后其它页链接 
        if (PagerBar.OtherBarFormat != "") { 
            if (PagerBar.PageIndex <= PagerBar.PageCount - PagerBar.ShowPagesCount / 2) { 
                return PagerBar.OtherBarFormat.replace(regexp, 
                PagerBar.PageIndex + PagerBar.ShowPagesCount >= PagerBar.PageCount ? PagerBar.PageCount : PagerBar.PageIndex + PagerBar.ShowPagesCount); 
            } 
            else { 
                return ""; 
            } 
        } 
        else { 
            return ""; 
        } 
    } 
    function GetCurrentRecordPageString() {//获取当前记录文本 
        if (PagerBar.CurrentRecordBarFormat != "") { 
            if (PagerBar.RecordCount == 0) { 
                return ""; 
            } 
            else { 
                return PagerBar.CurrentRecordBarFormat.replace("{0}", (PagerBar.PageIndex - 1) * PagerBar.PageSize + 1).replace("{1}", PagerBar.PageIndex * PagerBar.PageSize > PagerBar.RecordCount ? PagerBar.RecordCount : PagerBar.PageIndex * PagerBar.PageSize); 
            } 
        } 
        else return ""; 
    } 
    function GetCurrentPageBarString() {//获取当前页记录文本 
        if (PagerBar.CurrentPageBarFormat != "") { 
            return PagerBar.CurrentPageBarFormat.replace(regexp, PagerBar.PageIndex); 
        } 
        else return ""; 
    } 
    this.GetString = function (pageindex) {//输出HTML代码(全部模式） 
        if (pageindex != null && NumberRegex.test(pageindex)) {//如果传入了页索引则赋值 
            this.PageIndex = parseInt(pageindex); 
        } 
        if (this.PageCount == 0) {//如果没有计算过页总数，则计算页总数 
            CalculatePageCount(this.PageSize, this.RecordCount); 
        } 
        var pagestr = ""; 
        if (this.IsShowCurrentPageString) { 
            pagestr = GetCurrentPageBarString(); 
        } 
        if (this.IsShowCurrentRecordString) { 
            pagestr += GetCurrentRecordPageString(); 
        } 
        if (this.IsShowFristString) { 
            pagestr += GetFristPageString(); 
        } 
        if (this.IsShowPreviouString) { 
            pagestr += GetPreviouPageString(); 
        } 
        if (this.IsShowOtherString) { 
            pagestr += GetFrontOtherPageString(); 
        } 
        if (this.IsShowPageString) { 
            pagestr += GetPageString(); 
        } 
        if (this.IsShowOtherString) { 
            pagestr += GetAfterOtherPageString(); 
        } 
        if (this.IsShowNextString) { 
            pagestr += GetNextPageString(); 
        } 
        if (this.IsShowLastString) { 
            pagestr += GetLastPageString(); 
        } 
        return pagestr; 
    } 
    this.GetNormalString = function (pageindex) { 
        if (pageindex != null && NumberRegex.test(pageindex)) {//如果传入了页索引则赋值 
            this.PageIndex = parseInt(pageindex); 
        } 
        if (this.PageCount == 0) {//如果没有计算过页总数，则计算页总数 
            CalculatePageCount(this.PageSize, this.RecordCount); 
        } 
        var pagestr = ""; 
        pagestr += GetFristPageString(); 
        pagestr += GetPreviouPageString(); 
        pagestr += GetPageString(); 
        pagestr += GetNextPageString(); 
        pagestr += GetLastPageString(); 
        return pagestr; 
    } 
    this.GetSimpleString = function (pageindex) { 
        if (pageindex != null && NumberRegex.test(pageindex)) {//如果传入了页索引则赋值 
            this.PageIndex = parseInt(pageindex); 
        } 
        if (this.PageCount == 0) {//如果没有计算过页总数，则计算页总数 
            CalculatePageCount(this.PageSize, this.RecordCount); 
        } 
        var pagestr = ""; 
        pagestr += GetPreviouPageString(); 
        pagestr += GetCurrentPageBarString(); 
        pagestr += GetNextPageString(); 
        return pagestr; 
    } 
}