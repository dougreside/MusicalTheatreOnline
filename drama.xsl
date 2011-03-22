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

		
	<div>
		<xsl:apply-templates/>
		</div>

  </xsl:template>

<xsl:template match="tei:table">
<xsl:variable name="thisid" select="@xml:id"/>
	<table>
		<xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
		<xsl:apply-templates/>
	</table>	
</xsl:template>
<xsl:template match="tei:row">
		<xsl:variable name="thisid" select="@xml:id"/>
		<tr>
		<xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
		<xsl:apply-templates/>
	</tr>	
</xsl:template>	
<xsl:template match="tei:cell">
<xsl:variable name="thisid" select="@xml:id"/>
		<td>
		<xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
		
		<xsl:apply-templates/>
	</td>	
</xsl:template>	
<xsl:template match="tei:ptr">
		<xsl:variable name="ptrLoc" select="substring-after(@target,'#')"/>
	
		<xsl:apply-templates select="//*[@xml:id=$ptrLoc]"/>
		
</xsl:template>	
<!-- two declarations are needed for this key so that the '#' may be
    stripped from the @synch value -->
  <xsl:template match="tei:sp">
  
  	<div class="sp">
  	<xsl:variable name="thisid" select="@xml:id"/>
  	<xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
		
  		<xsl:apply-templates/>
  	</div>	

  </xsl:template>
  <xsl:template match="tei:p">
   		<xsl:variable name="thisid" select="@xml:id"/>
   		<div class="p">
   			<xsl:apply-templates/>
		</div>
 </xsl:template>

   <xsl:template match="//tei:sp/tei:p/tei:stage">
      <xsl:variable name="thisid" select="@xml:id"/>
      <div class="inner_stage">
      <xsl:apply-templates/>
    </div>
 </xsl:template>
    	

	

	<xsl:template match="tei:lg">
		<xsl:variable name="thisid" select="@xml:id"/>
			<div class="lg">
				<xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
				<xsl:attribute name="onclick">playAudio(this.id)</xsl:attribute>
			
			<xsl:apply-templates/></div>
			
</xsl:template>


	

<xsl:template match="tei:l">
	<xsl:variable name="thisid" select="@xml:id"/>

			<div class="line">
			
			<xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
				<xsl:attribute name="onclick">playAudio(this.id)</xsl:attribute>
			<xsl:apply-templates/></div>
			
</xsl:template>
<xsl:template match="tei:speaker">	
<xsl:variable name="thisid" select="@xml:id"/>


<div class="speaker">
<xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
	<xsl:apply-templates/>
	</div>
</xsl:template>
	

      <xsl:template match="tei:stage">
      <xsl:variable name="thisid" select="@xml:id"/>
      <div class="outer_stage">
      <xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
      <xsl:apply-templates/>
    </div>
  </xsl:template>
 <xsl:template match="//tei:teiHeader">
  
  </xsl:template>
  
 <xsl:template match="//tei:titlePart">
     <xsl:variable name="thisid" select="@xml:id"/>
 <div>
 <xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
 <xsl:apply-templates/></div>
  
  </xsl:template>
   <xsl:template match="//tei:docAuthor">
     <xsl:variable name="thisid" select="@xml:id"/>
 <div>
 <xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
 <xsl:apply-templates/></div>
  </xsl:template>
     <xsl:template match="//tei:front">
      <xsl:variable name="thisid" select="@xml:id"/>
 <div>
 <xsl:attribute name="id"><xsl:value-of select="$thisid"/></xsl:attribute>
 <xsl:apply-templates/></div><br/>
  
  </xsl:template>
</xsl:stylesheet>
