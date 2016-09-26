<!-----
@author Tyler Benton
@page tests/cfm-file
----->

<!----
@name One
@description
main method
---->
<cfform method="GET" action="#CGI.SCRIPT_NAME#">
  <cfinput name="overview" type="checkbox" value="1" checked="#URL.overview#" onchange="this.form.submit();" />
  <label for="overview">overview</label>
  <cfinput name="submitBtn" type="submit" value="Submit" />
</cfform>
<cfmap name="map01"centerAddress="San Francisco, CA" overview="#URL.overview#" />

<!----
@name Two
@description
This is a normal multi-line coldfusion comment.
---->
<cfquery name="getArtPrices" datasource="cfartgallery" maxRows="5">
  SELECT A.PRICE
  FROM ART A
</cfquery>

<cfset priceList = valueList(getArtPrices.price) />
<cfset priceArr = listToArray(priceList) />

<!--- This is a normal colfusion comment, and shouldn't start a new block --->

<cfscript>
<!----
@name Three
@description
This is another multi-line normal Coldfusion
Script comment made of single-line comments.
---->
component extends="Fruit" output="false" {
  property name="variety" type="string";
  public boolean function isGood() {
    return true;
  }
  private void eat(required numeric bites) {
    //do stuff
  }
}
</cfscript>

<!----
@name Four
@description
This is another normal multi-line coldfusion comment.
---->
<cfoutput>
  list: #priceList#<br/>
  sum: #numberFormat(arraySum(priceArr))#<br/>
  avg: #numberFormat(arrayAvg(priceArr))#<br/>
</cfoutput>
