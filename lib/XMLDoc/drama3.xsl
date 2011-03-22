<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  exclude-result-prefixes="xd exsl estr edate a fo local rng tei teix"
  extension-element-prefixes="exsl estr edate" version="1.0"
  xmlns:a="http://relaxng.org/ns/compatibility/annotations/1.0"
  xmlns:edate="http://exslt.org/dates-and-times"
  xmlns:estr="http://exslt.org/strings" xmlns:exsl="http://exslt.org/common"
  xmlns:fo="http://www.w3.org/1999/XSL/Format"
  xmlns:html="http://www.w3.org/1999/xhtml"
  xmlns:local="http://www.pantor.com/ns/local"
  xmlns:rng="http://relaxng.org/ns/structure/1.0"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  xmlns:teix="http://www.tei-c.org/ns/Examples"
  xmlns:xd="http://www.pnp-software.com/XSLTdoc"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xd:doc type="stylesheet">
    <xd:short> TEI stylesheet dealing with elements from the drama module,
      making HTML output. </xd:short>
    <xd:detail> This library is free software; you can redistribute it and/or
      modify it under the terms of the GNU Lesser General Public License as
      published by the Free Software Foundation; either version 2.1 of the
      License, or (at your option) any later version. This library is
      distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
      without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
      PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
      details. You should have received a copy of the GNU Lesser General Public
      License along with this library; if not, write to the Free Software
      Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA </xd:detail>
    <xd:author>See AUTHORS</xd:author>
    <xd:cvsId>$Id: drama.xsl 4801 2008-09-13 10:05:32Z rahtz $</xd:cvsId>
    <xd:copyright>2008, TEI Consortium</xd:copyright>
  </xd:doc>
  <xd:doc>
    <xd:short>Process elements tei:actor</xd:short>
    <xd:detail> </xd:detail>
  </xd:doc>
  <xsl:output method="html"/>
  
    <xsl:template match="tei:text">
    <HTML><HEAD>
    	<TITLE>Electronic Broadway Project</TITLE>
		<link rel="stylesheet" type="text/css" href="http://localhost:8888/EBP/lib/XMLDoc/EBPtext.css"/>
	</HEAD><BODY>
		<xsl:apply-templates/>
		</BODY>
		</HTML>
  </xsl:template>

	    <xsl:key name="synched" match="tei:sp[@synch]" use="substring-after(@synch,'#')"/>
		<xsl:key name="synched" match="tei:l[@synch]" use="substring-after(@synch,'#')"/>
		 <xsl:key name="synched" match="tei:sp" use="@xml:id"/>
	   <xsl:key name="synched" match="tei:l" use="@xml:id"/>

<!-- two declarations are needed for this key so that the '#' may be
    stripped from the @synch value -->
  <xsl:template match="tei:sp">
   <xsl:choose>
	<xsl:when test="@synch">	
 <xsl:if test="generate-id() = generate-id(key('synched',@xml:id)[1])">
 <!-- we pass this test only the first time we match an l element, identified
      either by its @xml:id or by the id of the element with which it
      is synched -->
	
	<table>
		<tr>
		
			   <xsl:for-each select="key('synched',@xml:id)">
			   		<td class="speaker">
					<xsl:value-of select="./tei:speaker"/>
					 </td>
			   </xsl:for-each>	
			  
			</tr>
 <tr>
   <xsl:for-each select="key('synched',@xml:id)">
   	 <td>
   		
   			<xsl:apply-templates/>
	</td>		
	</xsl:for-each>
</tr>
</table>
   <!-- now processing this l plus all the nodes it is synched with;
        the mode keeps us out of an infinite loop -->
 	
 </xsl:if>
 	</xsl:when>
	<xsl:otherwise>
			<div class="sp">
				<div class="speaker">
					<xsl:value-of select="./tei:speaker"/>
				</div>	
				<xsl:apply-templates/>
			</div>	
		</xsl:otherwise>
	</xsl:choose>	
  </xsl:template>
  <xsl:template match="tei:p">
   		<div class="p">
   			<xsl:apply-templates/>
		</div>
 </xsl:template>

   <xsl:template match="//tei:sp/tei:p/tei:stage">
      <div class="inner_stage">
      <xsl:apply-templates/>
    </div>
 </xsl:template>
    	

	

	


	

<xsl:template match="tei:l">
	<xsl:if test="../../@synch">
		
	</xsl:if>
				<xsl:apply-templates/>
			
</xsl:template>
<xsl:template match="tei:speaker">	
</xsl:template>
	

      <xsl:template match="tei:stage">
      <div class="outer_stage">
      <xsl:apply-templates/>
    </div>
  </xsl:template>
</xsl:stylesheet>
